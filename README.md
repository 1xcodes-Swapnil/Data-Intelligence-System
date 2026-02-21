

  Setup Instructions
1. Clone the Repository
git clone /https://github.com/1xcodes-Swapnil/datacollectionAIAgent
cd silver-ai-system

2. Create Virtual Environment
On Windows:
python -m venv venv
venv\Scripts\activate

On Mac/Linux:
python3 -m venv venv
source venv/bin/activate

3. Install Dependencies
pip install -r requirements.txt

4. Configure API Keys

Create a .env file in the root directory and add:

ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
GNEWS_API_KEY=your_gnews_api_key
Or in config.py:
ALPHA_KEY = "your_alpha_vantage_key"
GNEWS_KEY = "your_gnews_api_key"

5. Ensure Intelligence Modules Are Ready

Make sure these files exist:
intelligence/sentiment.py
intelligence/market.py

And your utils/price_fetcher.py is properly fetching prices.

6. Run the Backend Server
uvicorn main:app --reload

7. Frontend
1. Navigate to Frontend Directory
cd silver-pulse-dashboard

2. Install Frontend Dependencies
npm install

3. Start Development Server
npm run dev


You should see:

VITE v5.x ready
Local: http://localhost:8080/

4. Access Dashboard

Open in browser:
http://localhost:8080/

This will load the Silver Pulse AI Dashboard UI.

 5. Connect Frontend with Backend

Ensure backend is running:
uvicorn main:app --reload


Update your frontend API base URL if needed:
http://localhost:8000/silver/predict   

