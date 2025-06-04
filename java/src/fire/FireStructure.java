package fire;

import enums.Direction;

public class FireStructure {
    private final int[][] dataStructure;
    private int decayIntensity = 2;
    private final Direction winDirection = Direction.LEFT;

    public FireStructure(int rows, int columns, int minFireIntensity, int maxFireIntensity) {
        dataStructure = createDataStructure(rows, columns, maxFireIntensity);
        setFireSource(rows - 1, maxFireIntensity);
    }

    public int getDecayIntensity() {
        return decayIntensity;
    }

    public void setDecayIntensity(int newDecayIntensity) {
        decayIntensity = newDecayIntensity;
    }

    public int[][] getDataStructure() {
        return dataStructure;
    }

    public void recalculate() {
        calculateFirePropagation();
    }

    private int getBelowCellIntensity(int row, int column) {
        row = Math.min(row + 1, dataStructure.length - 1);
        return dataStructure[row][column];
    }

    private int[][] createDataStructure(int rows, int columns, int defaultFireIntensity) {
        int[][] dataStructure = new int[rows][columns];

        for (int row = 0; row < rows; row++)
            for (int column = 0; column < columns; column++)
                dataStructure[row][column] = defaultFireIntensity;

        return dataStructure;
    }

    private void updateFireIntensity(int row, int column) {
        int decay = (int) Math.floor(Math.random() * decayIntensity);

        int belowPixel = getBelowCellIntensity(row, column);
        int newFireIntensity = Math.max(belowPixel - decay, 0);

        int windOffset = (int) Math.floor(Math.random() * 2) * winDirection.getValue();
        int newColumn = Math.min(Math.max(column + windOffset, 0), dataStructure.length - 1);

        dataStructure[row][newColumn] = newFireIntensity;
    }

    public void calculateFirePropagation() {
        for (int row = 0; row < dataStructure.length - 1; row++)
            for (int column = 0; column < dataStructure[row].length; column++)
                updateFireIntensity(row, column);
    }

    private void setFireSource(int row, int fireIntensity) {
        for (int column = 0; column < dataStructure[row].length; column++)
            dataStructure[row][column] = fireIntensity;
    }
}