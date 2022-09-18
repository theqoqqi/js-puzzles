import styles from './App.module.css';
import {Route, Routes} from 'react-router';
import PuzzlePage from './pages/PuzzlePage/PuzzlePage';

function App() {
    return (
        <div className={styles.app}>
            <Routes>
                <Route path='/puzzles/:puzzleId' element={<PuzzlePage />} />
            </Routes>
        </div>
    );
}

export default App;
