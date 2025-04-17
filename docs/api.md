# API Documentation

## Overview

The PersonalityFramework API provides endpoints for personality assessment and analysis.

## Base URL

- Development: http://localhost:5000
- Production: https://api.PersonalityFramework.com

## Authentication

The API uses Bearer token authentication. Include the token in the Authorization header:

`
Authorization: Bearer <your-token>
`

## Endpoints

### GET /api/personality/traits

Returns a list of personality traits.

**Response**:
`json
[
 {
   "id": "string",
   "name": "string",
   "description": "string",
   "category": "string"
 }
]
`

### GET /api/personality/assessment/{id}

Returns a specific assessment by ID.

**Parameters**:
- id (path): The ID of the assessment

**Response**:
`json
{
 "id": "string",
 "userId": "string",
 "completedDate": "2023-01-01T00:00:00Z",
 "results": [
   {
     "traitId": "string",
     "score": 0.0
   }
 ]
}
`

### POST /api/personality/assessment

Creates a new assessment.

**Request Body**:
`json
{
 "userId": "string",
 "answers": [
   {
     "questionId": "string",
     "value": 0
   }
 ]
}
`

**Response**:
`json
{
 "id": "string",
 "userId": "string",
 "completedDate": "2023-01-01T00:00:00Z",
 "results": [
   {
     "traitId": "string",
     "score": 0.0
   }
 ]
}
`

## Error Responses

The API returns standard HTTP status codes:

- 200 OK - The request was successful
- 400 Bad Request - The request was invalid
- 401 Unauthorized - Authentication failed
- 404 Not Found - The resource was not found
- 500 Internal Server Error - Server error

Error response body:
`json
{
 "error": "string",
 "message": "string",
 "details": "string"
}
`

