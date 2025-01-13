# API Endpoints Documentation

This document contains all API endpoints in one place, including authorization requirements, request/response structures, and potential error messages.

## Contents

1. [Authorization & Forbidden Response]
2. [Session & User Endpoints]
   - [Get Current User]
   - [Login a User]
   - [Logout a User]
   - [Signup (Create New User)]
3. [Journaling Endpoints]
   - [Entries]
   - [Tags]
   - [Goals]
   - [Entry-Goals Linking]
   - [Milestones]

## Auth Endpoints

## All Endpoints that Require Proper Authorization

Any endpoint that requires authentication and the current user lacks the correct role(s) or permission(s) will return a **403 Forbidden** error if access is denied.

- **Request**: Any endpoint that requires proper authorization
- **Error Response**:
  - **Status Code**: `403`
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**:
    ```json
    {
    	"message": "Forbidden"
    }
    ```

---

## Get Current User

Retrieves the current logged-in user's information.

- **Require Authentication**: `true`
- **Request**:

  - **Method**: `GET`
  - **Route**: `/api/session`
  - **Body**: _(none)_

- **Successful Response (User Logged In)**:

  - **Status Code**: `200`
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**:
    ```json
    {
    	"userName": "string",
    	"firstName": "string",
    	"lastName": "string",
    	"email": "user@example.com",
    	"accountBalance": 1000,
    	"userId": 1
    }
    ```

- **Successful Response (No Logged In User)**:

  - **Status Code**: `200`
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**:
    ```json
    {
    	"user": null
    }
    ```

- **Error Response**:
  - **Status Code**: `500`
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**:
    ```json
    {
    	"msg": "user not found"
    }
    ```

---

## Login a User (Create User Session)

Creates a user session for authentication.

- **Require Authentication**: false

  - **Method**: `POST`
  - **Route**: `/api/login`
  - **Body**:
    ```json
    {
    	"credential": "string",
    	"password": "string"
    }
    ```

- **Successful Response**:
  - **Status Code**: `200`
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**: _(Could include user data or a success message, e.g.)_
    ```json
    {
    	"message": "Login successful",
    	"token": "jwt_or_session_token_here"
    }
    ```

---

## Logout a User (End Session)

Ends a user's current session, removing their authentication token/cookie.

- **Require Authentication**: `true`
- **Request**:

  - **Method**: `GET`
  - **Route**: `/api/logout`
  - **Body**: _(none)_

- **Successful Response**:
  - **Status Code**: `200`
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**: _(Optional message)_
    ```json
    {
    	"message": "User logged out successfully"
    }
    ```
- **Error Response**:
  - **Status Code**: `401` (if user not logged in)
  - **Status Code**: `500` (on server error)

---

## Signup (Create New User)

Creates a new user in the database and (optionally) logs them in immediately, returning the current user’s info.

- **Require Authentication**: `false`
- **Request**:

  - **Method**: `POST`
  - **Route**: `/api/signup`
  - **Body**:
    ```json
    {
    	"username": "string",
    	"firstName": "string",
    	"lastName": "string",
    	"email": "user@example.com",
    	"password": "string"
    }
    ```

- **Successful Response**:
  - **Status Code**: `201`
  - **Headers**:
    - `Content-Type: application/json`
  - **Body**:
    ```json
    {
    	"message": "User created and logged in",
    	"user": {
    		"userId": 1,
    		"username": "string",
    		"firstName": "string",
    		"lastName": "string",
    		"email": "user@example.com"
    	}
    }
    ```

## App Endpoints

Below are the core CRUD endpoints for **Entries**, **Tags**, **Goals**, **Milestones**, and their linking tables (`entry_tags`, `entry_goals`).  
All typically require the user to be authenticated, unless otherwise stated.

---

## Entries Endpoints

### GET `/api/entries`

Description: Retrieves all journal entries for the authenticated user, optionally filtered by goal or tag.

- **Query Params** (optional):
  - `goal_id`: Filter by a specific goal
  - `tag_id`: Filter by a specific tag
- **Response**:
  ```json
  [
  	{
  		"id": 1,
  		"user_id": 5,
  		"title": "My First Entry",
  		"body": "Some text...",
  		"sentiment": "Positive",
  		"weather": "Cloudy, 65°F",
  		"moon_phase": "Waxing Crescent",
  		"created_at": "2025-01-08T12:00:00Z"
  	}
  ]
  ```

### GET `/api/entries/:id`

Description: Retrieves a single entry by ID, including any linked tags or goals.

- **Response**:
  ```json
  {
  	"id": 10,
  	"user_id": 5,
  	"title": "A Reflective Day",
  	"body": "Detailed text...",
  	"sentiment": "Neutral",
  	"weather": "Sunny, 70°F",
  	"moon_phase": "New Moon",
  	"created_at": "2025-02-10T09:30:00Z",
  	"tags": [{ "id": 3, "name": "Morning", "color": "#FFD700" }],
  	"goals": [{ "id": 2, "title": "Learn Guitar", "status": "in_progress" }]
  }
  ```

### POST /api/entries

Description: Creates a new journal entry. Optionally link tags/goals by ID arrays.

- **Request Body**:

  ```json
  {
  	"title": "string",
  	"body": "string",
  	"sentiment": "string",
  	"weather": "Cloudy, 65°F",
  	"moon_phase": "Waxing Crescent",
  	"tag_ids": [1, 2],
  	"goal_ids": [3],
  	"user_id": 5
  }
  ```

- **Response**:
  ```json
  {
  	"message": "Entry created successfully",
  	"entry_id": 45
  }
  ```

### PUT /api/entries/:id

Description: Updates an existing entry, including any tags/goals associations.

- **Request Body**:

  ```json
  {
  	"title": "string",
  	"body": "string",
  	"sentiment": "string",
  	"weather": "Rainy, 60°F",
  	"moon_phase": "Full Moon",
  	"tag_ids": [1, 2],
  	"goal_ids": [3]
  }
  ```

- **Response**:
  ```json
  {
  	"message": "Entry updated successfully"
  }
  ```

### DELETE /api/entries/:id

Description: Deletes the specified entry, removing references in entry_tags or entry_goals.

- **Response**:

  ```json
  {
  	"message": "Entry deleted successfully"
  }
  ```

## Tags Endpoints

### GET /api/tags

Description: Retrieves all tags (default or user-created).

- **Response**:

  ```json
  [
  {
    "id": 1,
    "name": "Morning",
    "color": "#FFA500",
    "is_default": true
  },
  ...
  ]
  ```

### GET /api/tags/:id

Description: Retrieves a single tag by ID.

- **Response**:

  ```json
  {
  	"id": 5,
  	"name": "Gratitude",
  	"color": "#00FF00",
  	"is_default": false
  }
  ```

### POST /api/tags

Description: Creates a new tag—could be a system default or user-created.

- **Request Body**:

  ```json
  {
  	"name": "string",
  	"color": "string",
  	"is_default": false
  }
  ```

- **Response**:

  ```json
  {
  	"message": "Tag created successfully",
  	"tag_id": 5
  }
  ```

### PUT /api/tags/:id

Description: Updates an existing tag’s details.

- **Request Body**:

  ```json
  {
  	"name": "string",
  	"color": "string",
  	"is_default": false
  }
  ```

- **Response**:

  ```json
  {
  	"message": "Tag updated successfully"
  }
  ```

### DELETE /api/tags/:id

Description: Removes a tag, also cleaning up entry_tags references if necessary.

- **Response**:

  ```json
  {
  	"message": "Tag deleted successfully"
  }
  ```

## Goals Endpoints

### GET /api/goals

Description: Retrieves all goals for the authenticated user.

- **Response**:

  ```json
  [
  {
    "id": 2,
    "user_id": 5,
    "title": "Learn Guitar",
    "description": "I want to learn 5 songs",
    "status": "in_progress",
    "created_at": "2025-01-10T10:00:00Z"
  },
  ...
  ]
  ```

### GET /api/goals/:id

Description: Retrieves a single goal by ID, optionally including its linked entries and milestones.

- **Response**:

  ```json
  {
  	"id": 2,
  	"user_id": 5,
  	"title": "Learn Guitar",
  	"description": "I want to learn 5 songs",
  	"status": "in_progress",
  	"created_at": "2025-01-10T10:00:00Z",
  	"entries": [
  		{ "id": 10, "title": "Daily Practice Log", "sentiment": "Positive" }
  	],
  	"milestones": [
  		{ "id": 1, "milestone_name": "Buy Guitar", "is_completed": true }
  	]
  }
  ```

### POST /api/goals

Description: Creates a new goal. Status is typically an enum (in_progress, completed, on_hold, cancelled).

- **Request Body**:

  ```json
  {
  	"title": "string",
  	"description": "string",
  	"status": "in_progress",
  	"user_id": 5
  }
  ```

- **Response**:

  ```json
  {
  	"message": "Goal created successfully",
  	"goal_id": 2
  }
  ```

### PUT /api/goals/:id

Description: Updates goal properties and status.

- **Request Body**:

  ```json
  {
  	"title": "string",
  	"description": "string",
  	"status": "on_hold"
  }
  ```

- **Response**:

  ```json
  {
  	"message": "Goal updated successfully"
  }
  ```

### DELETE /api/goals/:id

Description: Removes a goal, cleaning up references in entry_goals or related milestones as needed.

- **Response**:

  ```json
  {
  	"message": "Goal deleted successfully"
  }
  ```

## Entry-Goals Linking

Manage many-to-many relationships between entries and goals with dedicated endpoints.

### POST /api/entry_goals

Description: Inserts a record into entry_goals to link the specified entry and goal.

- **Request Body**:

  ```json
  {
  	"entry_id": 45,
  	"goal_id": 2
  }
  ```

- **Response**:

  ```json
  {
  	"message": "Entry linked to goal successfully"
  }
  ```

### DELETE /api/entry_goals

Description: Removes the entry-goal relationship from entry_goals.

- **Request Body**:

  ```json
  {
  	"entry_id": 45,
  	"goal_id": 2
  }
  ```

- **Response**:

  ```json
  {
  	"message": "Entry unlinked to goal successfully"
  }
  ```

## Milestones Endpoints

### GET /api/milestones

Description: Retrieves all milestones, optionally filtered by goal_id.

- **Query Params** (optional):

  - `goal_id`: Filter by a specific goal

- **Response**:

  ```json
  [
  {
    "id": 1,
    "user_id": 5,
    "milestone_name": "Buy Guitar",
    "is_completed": true,
    "goal_id": 2,
    "created_at": "2025-01-12T08:00:00Z"
  },
  ...
  ]
  ```

### GET /api/milestones/:id

Description: Retrieves a single milestone by ID.

- **Response**:

  ```json
  {
  	"id": 3,
  	"user_id": 5,
  	"milestone_name": "Learn First Song",
  	"is_completed": false,
  	"goal_id": 2,
  	"created_at": "2025-01-15T09:00:00Z"
  }
  ```

### POST /api/milestones

Description: Creates a new milestone; goal_id is optional if not linking to a goal.

- **Request Body**:

  ```json
  {
  	"user_id": 5,
  	"milestone_name": "Play a small gig",
  	"goal_id": 2,
  	"is_completed": false
  }
  ```

- **Response**:

  ```json
  {
  	"message": "Milestone created successfully",
  	"milestone_id": 3
  }
  ```

### PUT /api/milestones/:id

Description: Updates the milestone’s name or completion status.

- **Request Body**:

  ```json
  {
  	"milestone_name": "Refine chord transitions",
  	"is_completed": true
  }
  ```

- **Response**:

  ```json
  {
  	"message": "Milestone updated successfully"
  }
  ```

### DELETE /api/milestones/:id

Description: Deletes the milestone from the database.

- **Response**:

  ```json
  {
  	"message": "Milestone deleted successfully"
  }
  ```

## Optional Weather/Moon Phase Endpoint & AI Sentiment Endpoint

### (Optional) GET /api/weather

- **Description**: Returns current weather based on user’s location (or stored lat/lng).
- **Require Authentication**: `true`
- **Query Params**: `lat`, `lng`, or `location`
- **Successful Response**
  - **Status Code**: `200`
  - **Body**:
    ```json
    {
    	"weather": "Cloudy, 65°F",
    	"moon_phase": "Waning Gibbous"
    }
    ```
- **Error Responses**
  - **400** if missing location data
  - **500** if external API call fails
