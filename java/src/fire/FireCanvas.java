package fire;

import javax.swing.*;

public class FireCanvas {
    private String[] palette;
    private JPanel firePanel;
    private FireStructure fireStructure;

    public FireCanvas(int width, int height, int rows, int columns) {
        this.palette = new String[] {
                "#070707",
                "#1f0707",
                "#2f0f07",
                "#470f07",
                "#571707",
                "#671f07",
                "#771f07",
                "#8f2707",
                "#9f2f07",
                "#af3f07",
                "#bf4707",
                "#c74707",
                "#df4f07",
                "#df5707",
                "#df5707",
                "#d75f07",
                "#d75f07",
                "#d7670f",
                "#cf6f0f",
                "#cf770f",
                "#cf7f0f",
                "#cf8717",
                "#c78717",
                "#c78f17",
                "#c7971f",
                "#bf9f1f",
                "#bf9f1f",
                "#bfa727",
                "#bfa727",
                "#bfaf2f",
                "#b7af2f",
                "#b7b72f",
                "#b7b737",
                "#cfcf6f",
                "#dfdf9f",
                "#efefc7",
                "#ffffff"
        };

        this.fireStructure = new FireStructure(rows, columns, 0, palette.length - 1);
        this.firePanel = new FirePanel(width, height, rows, columns, fireStructure.getDataStructure(), palette);


        new Thread(() -> {
            while (true) {
                this.fireStructure.recalculate();
                this.firePanel.repaint();

                try {
                    Thread.sleep(1000 / 24);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    break;
                }
            }
        }).start();
    }

    public JPanel getPanel() {
        return firePanel;
    }
}
