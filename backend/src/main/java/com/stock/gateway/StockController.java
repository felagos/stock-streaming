package com.stock.gateway;

import com.stock.grpc.*;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class StockController {

    private static final Logger logger = Logger.getLogger(StockController.class.getName());

    @GrpcClient("stock-server")
    private StockServiceGrpc.StockServiceStub stockServiceStub;

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping("/stocks")
    public List<StockPriceDTO> getAllStocks() {
        logger.info("Fetching all available stocks");
        String[] symbols = {"AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"};
        List<StockPriceDTO> stocks = new ArrayList<>();
        long now = System.currentTimeMillis();

        for (String symbol : symbols) {
            stocks.add(new StockPriceDTO(
                symbol,
                150.0 + Math.random() * 50,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5,
                now
            ));
        }
        return stocks;
    }

    @GetMapping("/stream/sse")
    public SseEmitter streamStockPrices(@RequestParam(defaultValue = "AAPL,GOOGL,MSFT,AMZN,TSLA") String symbols) {
        SseEmitter emitter = new SseEmitter(0L); // No timeout - let client control
        String emitterId = UUID.randomUUID().toString();
        emitters.put(emitterId, emitter);

        logger.info("New SSE client connected: " + emitterId);

        emitter.onCompletion(() -> {
            logger.info("SSE client completed: " + emitterId);
            emitters.remove(emitterId);
        });
        emitter.onTimeout(() -> {
            logger.info("SSE client timeout: " + emitterId);
            emitters.remove(emitterId);
        });

        List<String> symbolList = Arrays.asList(symbols.split(","));
        SubscribeRequest request = SubscribeRequest.newBuilder()
            .addAllSymbols(symbolList)
            .build();

        stockServiceStub.streamStockPrices(request, new StreamObserver<StockPrice>() {
            private volatile boolean completed = false;

            @Override
            public void onNext(StockPrice value) {
                if (completed || !emitters.containsKey(emitterId)) {
                    return; // Silently ignore if already completed
                }
                
                try {
                    Map<String, Object> data = new HashMap<>();
                    data.put("symbol", value.getSymbol());
                    data.put("price", value.getPrice());
                    data.put("change", value.getChange());
                    data.put("changePercent", value.getChangePercent());
                    data.put("timestamp", value.getTimestamp());

                    SseEmitter.SseEventBuilder event = SseEmitter.event()
                        .id(emitterId)
                        .name("stock-update")
                        .data(data);

                    emitter.send(event);
                } catch (IOException | IllegalStateException e) {
                    completed = true;
                    emitters.remove(emitterId);
                }
            }

            @Override
            public void onError(Throwable t) {
                if (completed || !emitters.containsKey(emitterId)) {
                    return; // Silently ignore if already completed
                }
                
                completed = true;
                if (!t.getMessage().contains("CANCELLED")) {
                    logger.warning("gRPC stream error: " + t.getMessage());
                }
                
                try {
                    emitter.send(SseEmitter.event().id(emitterId).name("error").data("Connection error"));
                } catch (IOException | IllegalStateException e) {
                }
                emitters.remove(emitterId);
            }

            @Override
            public void onCompleted() {
                if (completed || !emitters.containsKey(emitterId)) {
                    return; // Silently ignore if already completed
                }
                
                completed = true;
                logger.info("gRPC stream completed for client: " + emitterId);
                try {
                    emitter.send(SseEmitter.event().id(emitterId).name("done").data("Stream completed"));
                    emitter.complete();
                } catch (IOException | IllegalStateException e) {
                }
                emitters.remove(emitterId);
            }
        });

        return emitter;
    }

    @PostMapping("/disconnect/{emitterId}")
    public void disconnect(@PathVariable String emitterId) {
        SseEmitter emitter = emitters.remove(emitterId);
        if (emitter != null) {
            try {
                emitter.complete();
                logger.info("Emitter disconnected: " + emitterId);
            } catch (Exception e) {
                logger.severe("Error disconnecting emitter: " + e.getMessage());
            }
        }
    }
}
