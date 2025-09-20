# File: /my-web-app/my-web-app/client/styles/README.md

# Styling Approach

This folder contains the styles for the client-side of the application, utilizing Tailwind CSS for utility-first styling. 

## Tailwind CSS

- **tailwind.css**: This file imports the Tailwind CSS base, components, and utilities. It serves as the main entry point for Tailwind styles in the application.
  
## Global Styles

- **globals.css**: This file contains global styles that apply to the entire application. Use this file to define styles that are not covered by Tailwind CSS utilities.

## Usage

To use Tailwind CSS in your components, ensure that you have the necessary classes applied directly in your JSX. For any custom styles, add them to `globals.css` as needed.

## Customization

You can customize Tailwind's default configuration by modifying the `tailwind.config.js` file located in the root of the project. This allows you to extend the default theme, add custom colors, spacing, and more.