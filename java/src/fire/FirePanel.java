package fire;

import javax.swing.*;
import java.awt.*;

public class FirePanel extends JPanel {
    private final int rows;
    private final int columns;
    private String[] palette;
    private int[][] fireStructure;

    public FirePanel(int width, int height, int rows, int columns, int[][] fireStructure, String[] palette) {
        this.fireStructure = fireStructure;

        this.palette = palette;
        this.rows = rows;
        this.columns = columns;

        setSize(width, height);
    }

    public int getCellSize() {
        return getWidth() / rows;
    }

    @Override
    public void paintComponent(Graphics graphics) {
        int cellSize = getCellSize();

        for (int row = 0; row < rows; row++)
            for (int column = 0; column < columns; column++) {
                int colorIntensity = fireStructure[row][column];

                graphics.setColor(Color.decode(palette[colorIntensity]));
                graphics.fillRect(column * cellSize, row * cellSize, cellSize, cellSize);
            }
    }
}
