package com.stock.grpc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import com.stock.model.StockData;

import io.grpc.stub.ServerCallStreamObserver;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class StockServiceImpl extends StockServiceGrpc.StockServiceImplBase {
    
    private static final Logger logger = Logger.getLogger(StockServiceImpl.class.getName());
    private static final Map<String, StockData> STOCK_DATA = new HashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);

    static {
        STOCK_DATA.put("AAPL", new StockData("AAPL", 150.25, 1.25));
        STOCK_DATA.put("GOOGL", new StockData("GOOGL", 140.50, -0.75));
        STOCK_DATA.put("MSFT", new StockData("MSFT", 380.75, 2.30));
        STOCK_DATA.put("AMZN", new StockData("AMZN", 175.40, -1.10));
        STOCK_DATA.put("TSLA", new StockData("TSLA", 245.80, 3.50));
    }

    @Override
    public void streamStockPrices(SubscribeRequest request, 
                                 StreamObserver<StockPrice> responseObserver) {
        logger.info("Client subscribed to " + request.getSymbolsList().size() + " stocks");
        
        List<String> symbols = request.getSymbolsList().isEmpty() 
            ? new ArrayList<>(STOCK_DATA.keySet()) 
            : request.getSymbolsList();

        final ServerCallStreamObserver<StockPrice> serverCallStreamObserver = 
            (ServerCallStreamObserver<StockPrice>) responseObserver;
        
        final ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(() -> {
            try {
                if (serverCallStreamObserver.isCancelled()) {
                    return; // Stop sending if cancelled
                }
                
                for (String symbol : symbols) {
                    StockData data = STOCK_DATA.getOrDefault(symbol, 
                        new StockData(symbol, 100.0, 0.0));
                    
                    data.updatePrice();
                    
                    StockPrice price = StockPrice.newBuilder()
                        .setSymbol(symbol)
                        .setPrice(data.getPrice())
                        .setChange(data.getChange())
                        .setChangePercent(data.getChangePercent())
                        .setTimestamp(System.currentTimeMillis())
                        .build();
                    
                    responseObserver.onNext(price);
                }
            } catch (Exception e) {
                if (!e.getMessage().contains("CANCELLED")) {
                    logger.warning("Error streaming prices: " + e.getMessage());
                }
            }
        }, 0, 2, TimeUnit.SECONDS);
        
        serverCallStreamObserver.setOnCancelHandler(() -> {
            logger.info("Client cancelled subscription");
            future.cancel(false);
        });
    }

    @Override
    public void getAllStocks(Empty request, 
                            StreamObserver<StockList> responseObserver) {
        StockList stockList = StockList.newBuilder()
            .addAllSymbols(STOCK_DATA.keySet())
            .build();
        
        responseObserver.onNext(stockList);
        responseObserver.onCompleted();
    }
}
