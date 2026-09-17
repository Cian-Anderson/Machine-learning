/*
Author: Cian Anderson
Student Number: C22793219
Date: 17/04/2024

Description:
Class representing individual instances (reviews) in the machine learning project.
Each instance contains features such as hours played, hour-to-price ratio, platform information,
and whether it is recommended or not.

*/

package machine_learning;

public class Instance {
    // Features
    private final double hoursPlayed; // The number of hours played by the user.
    private final double HourToPriceRatio; // The ratio of hours played to the price of the game.
    private final boolean windows; // Indicates if the game is played on Windows.
    private final boolean mac; // Indicates if the game is played on Mac.
    private final boolean linux; // Indicates if the game is played on Linux.
    // Label
    private final boolean recommended; // Indicates if the game is recommended by the user.

    // Constructor for creating an instance with specified features and label.
    public Instance(double hoursPlayed, double HourToPriceRatio, boolean windows, boolean mac, boolean linux, boolean recommended) {
        this.hoursPlayed = hoursPlayed;
        this.HourToPriceRatio = HourToPriceRatio;
        this.windows = windows;
        this.mac = mac;
        this.linux = linux;
        this.recommended = recommended;
    }

    // Getters for the features
    public double getHoursPlayed() { return hoursPlayed; }
    public double getHourToPriceRatio() { return HourToPriceRatio; }
    public boolean isWindows() { return windows; }
    public boolean isMac() { return mac; }
    public boolean isLinux() { return linux; }
    // Getter for the label
    public boolean isRecommended() { return recommended; }
}

