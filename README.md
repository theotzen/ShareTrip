# ShareTrip

## Objectives

The goal of _ShareTrip_ is to allow users from new arrivals in train station and airport to plan, meet and share a trip
back home.

## How ?

Users arriving at a destination train station/airport will be able to look at all shared trip back to several towns or
propose new ones.
Each trip is composed of :

- Departure location
- Departure date and time
- Locomotion mode (Have your own car ? Want to share a taxi/VTC ?)
- Number a seats available
- Single price per person

For each trip, a real-time chat room with all registered users is created, allowing travelers to meet up and discuss the
details.

## Why ?

50% of all taxi/VTC trips in Paris are for/coming from airports.
Carpooling could mitigate cars CO2 emissions by approximately 30%.

## Technically ?

The **Front End** will be constructed with

- React.ts

The **Back End** will be constructed with

- FastAPI
- MongoDB + pymongo
- Socket.io
- Nginx as an API gateway
- JWT for OAuth2
