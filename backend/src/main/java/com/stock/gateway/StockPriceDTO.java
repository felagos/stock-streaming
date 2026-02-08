package com.stock.gateway;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StockPriceDTO {
    @JsonProperty("symbol")
    private String symbol;

    @JsonProperty("price")
    private double price;

    @JsonProperty("change")
    private double change;

    @JsonProperty("changePercent")
    private double changePercent;

    @JsonProperty("timestamp")
    private long timestamp;

    public StockPriceDTO() {
    }

    public StockPriceDTO(String symbol, double price, double change, double changePercent, long timestamp) {
        this.symbol = symbol;
        this.price = price;
        this.change = change;
        this.changePercent = changePercent;
        this.timestamp = timestamp;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getChange() {
        return change;
    }

    public void setChange(double change) {
        this.change = change;
    }

    public double getChangePercent() {
        return changePercent;
    }

    public void setChangePercent(double changePercent) {
        this.changePercent = changePercent;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
