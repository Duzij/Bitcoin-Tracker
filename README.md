# Bitcoin Tracker V4

This project is an experimental attempt to explore how far "vibe coding" can go. It represents the fourth iteration, as previous versions encountered issues along the way. The functional requirements and design only became clear after starting the implementation process.

The project was initiated using prompt engineering with GPT-4 to create a starting prompt for [JDoodle](https://www.jdoodle.ai/p/533a2394-f366-418d-a6f6-ac746ad2c051). The initial inspiration for the prompt was taken from [awesome_ai_for_programmers](https://github.com/Duzij/awesome_ai_for_programmers). The full journey of how this project was created is documented in this [Threads post](https://www.threads.net/@max_duz/post/DH0cRQLOM4j?xmt=AQGzkjjD4IC4qU4wiEvn7UcYoE6N_frlB3ijMW0m1LGCsg).

---

## Features

- **Historical Bitcoin Data**: Load Bitcoin historical data starting from April 4th, 2025.
- **Daily Updates**: New Bitcoin price data and related news are fetched every 24 hours via a Supabase scheduled function.
- **News Integration**:
  - Fetch the most popular articles from NewsAPI if the daily price change exceeds 3%.
  - If the price change exceeds 6%, fetch 3 articles; otherwise, fetch 1 article.
- **Date Range Selection**: Users can select a custom date range to view historical Bitcoin prices and related news.

---

## Project Status

The project is feature-complete but open for forks and pull requests. Contributions are welcome to enhance functionality or improve the design.

