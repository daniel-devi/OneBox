import '../styles/NotFound.css'
import Navbar from '../components/Navbar'

function NotFound() {
    return <div id='Notfound'>
        <Navbar/>
        <div className="notfound">
           <h1 id='h1'>404 Not Found</h1>
            <p id='p'>The page you're looking for doesn't exist!</p> 
            
            <span>❌</span>
        </div>
        
    </div>
}

export default NotFound