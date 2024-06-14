# FoodMate

FoodMate is an Angular application with Firebase that helps you track your food intake, meals, macronutrients, micronutrients, and nutrients using a conversational agent. The agent automates the data entry process, asks for missing meal information, and provides dietary suggestions based on your input.

## Features

- Conversational agent for automatic food intake tracking
- Manual form entry for food and meals
- Macronutrient and micronutrient tracking
- Dietary suggestions based on input
- Integration with iPhone Health app, MyFitnessPal, and Pcal (future)
- Personalized diet plans (low potassium, low vitamin K, intermittent fasting, etc.)
- Support for tracking irritable bowel syndrome and allergies

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/peterviou/foodMate.git
   ```
2. Navigate to the project directory
   ```bash
   cd foodMate
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Set up Firebase
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add a web app and copy the configuration details
   - Add Firebase configuration to `src/environments/environment.ts`
     ```typescript
     export const environment = {
       production: false,
       openaiApiKey: "your-api-key",
       firebaseConfig: {
         apiKey: "your-api-key",
         authDomain: "your-auth-domain",
         projectId: "your-project-id",
         storageBucket: "your-storage-bucket",
         messagingSenderId: "your-messaging-sender-id",
         appId: "your-app-id",
       },
     };
     ```
5. Run the application
   ```bash
   ng serve
   ```

## Usage

Once the application is running, you can start tracking your food intake using the conversational agent or the manual forms. The agent will provide suggestions and reminders based on your input.

### Authentication

- Navigate to `/auth/login` to log in.
- Navigate to `/auth/signup` to sign up for a new account.

### Meals Management

- View meals list: `/meal/list`
- Add a new meal: `/meal/add`
- Edit a meal: `/meal/edit/:id`
- View meal details: `/meal/detail/:id`

### Chat

- Access the chat: `/chat`

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

### Coding Standards

- Follow the Angular style guide for structuring and organizing code.
- Use Tailwind CSS for styling.

### Folder Structure

src/
app/
auth/
chat/
meal/
shared/
assets/
environments/

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
