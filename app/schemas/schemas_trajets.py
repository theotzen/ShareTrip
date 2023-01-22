from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, constr, validator


list_of_allowed_departure_places: List[str] = ['Gare de Lyon', 'Gare Saint-Lazare', 'Gare Montparnasse']
list_locomotion: List[str] = ['Voiture', 'Taxi', 'VTC', 'Moto']


class TrajetBaseSchema(BaseModel):

    # creator
    user_id: str

    # departure info
    departure_place: str
    departure_time: datetime

    # arrival info
    arrival_city: str
    arrival_street: str
    arrival_postal_code: str

    # trip info
    locomotion: str
    seats_left: int
    users_registered: List[str]
    total_price_to_share: Optional[float]
    linked_chat_id: Optional[str]
    created_at: Optional[datetime] = datetime.utcnow()
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

    @validator("departure_place")
    def validate_departure_place(cls, value):
        if value not in list_of_allowed_departure_places:
            raise ValueError("Our terms strictly prohobit non-allowed departure places")
        return value

    @validator("locomotion")
    def validate_locomotion(cls, value):
        if value not in list_locomotion:
            raise ValueError("Our terms strictly prohobit non-allowed locomotion types")
        return value


class CreateTrajetSchema(BaseModel):
    user_id: Optional[str]
    # departure info
    departure_place: str
    departure_time: datetime

    # arrival info
    arrival_city: str
    arrival_street: str
    arrival_postal_code: str

    # trip info
    locomotion: str
    seats_left: int
    total_price_to_share: Optional[float]

    users_registered: Optional[List[str]]
    linked_chat_id: Optional[str]
    created_at: Optional[datetime] = datetime.utcnow()
    updated_at: Optional[datetime]


class TrajetUpdateSchema(BaseModel):
    # Trajet id
    id: str

    departure_place: Optional[str]
    departure_time: Optional[datetime]

    arrival_city: Optional[str]
    arrival_street: Optional[str]
    arrival_postal_code: Optional[str]

    locomotion: Optional[str]
    seats_left: Optional[int]
    total_price_to_share: Optional[float]
    updated_at: Optional[datetime] = datetime.utcnow()


class TrajetResponseSchema(TrajetBaseSchema):
    id: str
    pass


class TrajetResponse(BaseModel):
    trajet: TrajetResponseSchema
