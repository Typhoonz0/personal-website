#!/bin/bash

# Clone the repository and navigate into the directory
git clone https://github.com/Typhoonz0/dots.git && cd dots || exit

# Function to print the prompt
prompt() {
     echo -ne "\e[31m$USER\e[0m@dotsinstall\e[0m # "
}

# List of config directories
config_dirs=(
    "$HOME/.config/fastfetch"
    "$HOME/.config/ghostty"
    "$HOME/.config/hypr"
    "$HOME/.config/nvim"
    "$HOME/.config/rofi"
    "$HOME/.config/tmux"
    "$HOME/.config/waybar"
    "$HOME/.config/zsh"
)

# Clear the screen and display a banner
clear
cat <<EOF
__________                         _________     _____        
___  /__(_)_____ _______ ___       ______  /_______  /________
__  /__  /_  __ \_  __ \__ \_______  __  /_  __ \  __/_  ___/
_  / _  / / /_/ /  / / / / //_____/ /_/ / / /_/ / /_ _(__  ) 
/_/  /_/  \__,_/  /_/ /_/ /_/       \__,_/  \____/\__/ /____/  

This will install:
fastfetch, ghostty, hyprland, neovim, tmux, waybar, 
zsh, rofi, swaybg, blueberry, and other dependencies. 
This script **WILL OVERWRITE** any existing configs.

Do you want to continue? (y/n)
EOF

prompt && read -r confirm 
if [[ "$confirm" =~ ^[Nn]$ ]]; then 
    exit
fi

# Array to store required packages
required=()

# Package installation logic
for expanded_dir in "${config_dirs[@]}"; do
    case "$expanded_dir" in
        "$HOME/.config/fastfetch")
            required+=("fastfetch")  
            ;;
        "$HOME/.config/ghostty")
            required+=("ghostty")
            ;;
        "$HOME/.config/hypr")
            required+=("hyprland" "ghostty" "nautilus" "firefox" "rofi" "swaybg" "waybar" "blueberry")
            ;;
        "$HOME/.config/nvim")
            required+=("neovim")
            ;;
        "$HOME/.config/rofi")
            required+=("rofi")
            ;;
        "$HOME/.config/tmux")
            required+=("tmux")
            ;;
        "$HOME/.config/waybar")
            required+=("waybar")
            ;;
        "$HOME/.config/zsh")
            required+=("zsh")
            ;;
        *)
            echo "No installation logic defined for $expanded_dir."
            ;;
    esac
done

# Install required packages
if [ ${#required[@]} -ne 0 ]; then
    echo "Installing required packages: ${required[*]}..."
    sudo pacman -S --noconfirm "${required[@]}" || true

    if [[ " ${required[*]} " =~ " zsh " ]]; then
        sudo pacman -S --noconfirm zsh || true
        chsh -s "/usr/bin/zsh" || true
        cp .zshrc ~/.zshrc
    fi
else
    echo "No additional packages are required."
fi

# Overwrite configs after package installation
echo "Overwriting configuration files..."
for expanded_dir in "${config_dirs[@]}"; do
    config_name=$(basename "$expanded_dir")  # Extract folder name

    echo "Copying $config_name to $expanded_dir..."
    mkdir -p "$expanded_dir"
    
    # Copy contents instead of the directory itself
    cp -r "$config_name/"* "$expanded_dir/" || true  
    
    echo "Copied $config_name to $expanded_dir."
done

sudo pacman -S --needed git base-devel && git clone https://aur.archlinux.org/yay-bin.git && cd yay-bin && makepkg -si
yay -S wlogout

echo "Installation and configuration setup complete."
