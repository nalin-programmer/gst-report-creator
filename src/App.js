import './App.css';
import ExcelProcessor from './coponents/ExcelTable';
import PivotTablePage from './coponents/PivotTable';
import HomePage from './coponents/HomePage';

function App() {
    const path = window.location.pathname;

    if (path === '/') {
        return <HomePage />;
    }

    if (path === '/monthlyCalculation') {
        return <ExcelProcessor />;
    }

    if (path === '/pivotTable') {
        return <PivotTablePage />;
    }

    return <HomePage />;
}

export default App;
