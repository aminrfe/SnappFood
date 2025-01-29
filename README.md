# SnappFood

Welcome to the **SnappFood** project! This repository contains the code for both the front-end and back-end of the SnappFood application.

## :clipboard: Table of Contents

- [:book: Introduction](#introduction)
- [:gear: Technologies](#technologies)
- [:rocket: Getting Started](#getting-started)
- [:scroll: Available Scripts](#available-scripts)
- [:busts_in_silhouette: User Roles](#user-roles)
- [:electric_plug: API Functionalities](#api-functionalities)
- [:package: Deployment](#deployment)

## :book: Introduction <a id="introduction"></a>

The **SnappFood** project is a clone of the popular food delivery service that allows users to browse restaurants, view menus, and place orders. This project includes two main components:

1. **Front-end**: User interface for customers, restaurant owners, and administrators.
2. **Back-end**: API services and database management.

## :gear: Technologies <a id="technologies"></a>

The project leverages the following technologies:

- **Front-end**: ReactJS
- **Back-end**: Django & Django REST Framework
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## :rocket: Getting Started <a id="getting-started"></a>

Follow these steps to set up and run the project locally:

### Prerequisites

- **Docker**
- **Docker Compose**

If running without Docker, ensure the following are installed:

- **Node.js**
- **npm**
- **Python**

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/aminrfe/snappfood.git
    cd snappfood
    ```

2. Create a `.env` file in the `snappfood` directory with the following content:
    ```env
    DJANGO_SECRET_KEY=your_secret_key
    DATABASE_ENGINE=django.db.backends.postgresql
    DATABASE_NAME=snappfood
    DATABASE_USER=postgres
    DATABASE_PASSWORD=1234
    DATABASE_HOST=db
    DATABASE_PORT=5432
    DJANGO_SUPERUSER_PHONE_NUMBER=9112223344
    DJANGO_SUPERUSER_PASSWORD=1234
    ```

### Running the Project

#### Using Docker

1. Build and start the containers:
    ```bash
    docker-compose up --build
    ```

2. Access the application:
    - **Front-end**: [http://localhost:3000](http://localhost:3000)
    - **Back-end**: [http://localhost:8000](http://localhost:8000)

#### Without Docker

1. Set up the back-end:
    ```bash
    cd back-end/snappfood
    python -m venv env
    source env/bin/activate  # On Windows, use `env\Scripts\activate`
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

2. Set up the front-end:
    ```bash
    cd front-end
    npm install
    npm start
    ```

## :scroll: Available Scripts <a id="available-scripts"></a>

### Front-end

- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production.

### Back-end

- `python manage.py runserver`: Runs the Django development server.
- `python manage.py test`: Runs the test suite.

## :busts_in_silhouette: User Roles <a id="user-roles"></a>

The application supports the following roles:

- **Customer**: Browse restaurants, view menus, and place orders.
- **Restaurant Owner**: Manage restaurant menus and orders.
- **Admin**: Full access to users, restaurants, and orders.

## :electric_plug: API Functionalities <a id="api-functionalities"></a>

The back-end API provides the following features:

### Authentication

- **JWT Authentication**: Obtain and refresh tokens via `/api/auth/token` and `/api/auth/token/refresh`.

### Customer Features

- Manage carts, orders, and profiles.
- Browse menus and manage favorite restaurants.
- Leave reviews for restaurants.

### Restaurant Owner Features

- Manage restaurant profiles and menus.
- View and update order statuses.
- Generate sales reports.

### Admin Features

- Manage users, restaurants, and orders.
- Approve or reject new restaurant registrations.

For detailed API documentation, visit the Swagger interface: [http://localhost:8000/swagger](http://localhost:8000/swagger).

## :package: Deployment <a id="deployment"></a>

You can deploy the project using Docker or manually:

### Using Docker

1. Build and start the containers:
    ```bash
    docker-compose up --build
    ```

2. Access the application:
    - **Front-end**: [http://localhost:3000](http://localhost:3000)
    - **Back-end**: [http://localhost:8000](http://localhost:8000)

### Without Docker

1. Set up the back-end:
    ```bash
    cd back-end/snappfood
    python -m venv env
    source env/bin/activate  # On Windows, use `env\Scripts\activate`
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

2. Set up the front-end:
    ```bash
    cd front-end
    npm install
    npm start
    ```
