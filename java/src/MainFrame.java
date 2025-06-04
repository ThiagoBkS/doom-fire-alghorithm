import fire.FireCanvas;
import fire.events.ResizeListener;

import javax.swing.*;
import java.awt.*;

public class MainFrame extends JFrame {
    public Component component = getContentPane();

    public MainFrame(int width, int height) {
        setSize(width, height);
        setLayout(null);
        setResizable(true);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setVisible(true);

        component.setBackground(Color.BLACK);

        FireCanvas canvas = new FireCanvas(width, height, 126, 126);
        add(canvas.getPanel(), BorderLayout.CENTER);

        addComponentListener(new ResizeListener());
    }
}
