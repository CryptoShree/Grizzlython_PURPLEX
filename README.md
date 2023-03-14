# PURPLEX - Solana Helium 5g Hotspot xNFT explorer. 

WATCH THE DEMO VIDEO. https://www.youtube.com/watch?v=QZMEZ43d27k&t=2s

Submission by PurpleSquirrelDAO - Matthew Karsten & CryptoSHREE. 

![Screenshot 2023-03-14 at 3 28 22 AM](https://user-images.githubusercontent.com/101166268/224926855-ef1eb72b-5d6f-434c-b9dc-10d4fd9f1c0f.png)

## Getting Started:

### 1. First, clone the repository to your local machine and navigate into the folder. For example:

```bash
git clone https://github.com/CryptoShree/Grizzlython_PURPLEX.git
cd Grizzlython_PURPLEX
```

### 2. Second, install all the dependencies:

#### System dependencies:
* cmake
* postgres - add user/password postgres/postgres
* postgis

#### Application Dependencies:
* Install dependencies with `mix deps.get`
* Create and migrate your database with `mix ecto.setup`  

### 3. Edit your environment variables:

* Open the .env file located at the root of the project
* Create a Mapbox account and copy your public access token
* Paste it in place of <replace me> for the PUBLIC_MAPBOX_KEY variable. That line should now look like this:

`PUBLIC_MAPBOX_KEY=pk.ey[...the rest of your access token...]`

### 4. Install Node.js dependencies with `cd assets && yarn`

### 5. Start development server:
* Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

To Reset Database

  * Run `mix ecto.reset`




