import styles from './App.module.css';
import {Route, Routes} from 'react-router';
import PuzzlePage from './pages/PuzzlePage/PuzzlePage';
import PuzzleListPage from './pages/PuzzleListPage/PuzzleListPage';
import PuzzleEditorPage from './pages/PuzzleEditorPage/PuzzleEditorPage';

function App() {
    return (
        <div className={styles.app}>
            <Routes>
                <Route path='/puzzles' element={<PuzzleListPage />} />
                <Route path='/puzzles/:puzzleId' element={<PuzzlePage />} />
                <Route path='/editor/puzzles' element={<PuzzleEditorPage />} />
                <Route path='/editor/puzzles/:puzzleId' element={<PuzzleEditorPage />} />
            </Routes>
        </div>
    );
}

export default App;
