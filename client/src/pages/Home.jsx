import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import "../styles/home.css";

function Home() {
    return (
        <>
        <Navbar />
        
        <main className="home">
            <h1>Chat with any YouTube video</h1>

            <p>
                QueryTube allows you to chat with YouTube videos
                in real-time using AI.
            </p>

            <SearchBar />
        </main>
        </>
    );
}

export default Home;