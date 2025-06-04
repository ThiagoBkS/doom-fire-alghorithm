package enums;

public enum Direction {
    LEFT(-1),
    RIGHT(1),
    DEFAULT(0);

    private int value;

    Direction(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
