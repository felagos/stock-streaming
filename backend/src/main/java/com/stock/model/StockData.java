package com.stock.model;

public class StockData {
    private String symbol;
    private double price;
    private double changePercent;

    public StockData(String symbol, double price, double changePercent) {
        this.symbol = symbol;
        this.price = price;
        this.changePercent = changePercent;
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

    public double getChangePercent() {
        return changePercent;
    }

    public void setChangePercent(double changePercent) {
        this.changePercent = changePercent;
    }

    public void updatePrice() {
        double change = (Math.random() - 0.5) * 2;
        this.price += change;
        this.changePercent = (change / this.price) * 100;
    }

    public double getChange() {
        return price * (changePercent / 100);
    }

    @Override
    public String toString() {
        return "StockData{" +
                "symbol='" + symbol + '\'' +
                ", price=" + price +
                ", changePercent=" + changePercent +
                '}';
    }
}
