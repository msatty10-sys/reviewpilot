from typing import List, Dict
from pydantic import BaseModel
from datetime import date

class AnalyticsSummary(BaseModel):
    total_requests: int
    sent_requests: int
    opened_requests: int
    clicked_requests: int
    completed_requests: int
    conversion_rate: float

class DailyTrend(BaseModel):
    date: date
    count: int

class AnalyticsDashboard(BaseModel):
    summary: AnalyticsSummary
    daily_trends: List[DailyTrend]
