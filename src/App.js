import './App.css';
import ExcelProcessor from './coponents/ExcelTable';
import PivotTablePage from './coponents/PivotTable';

function App() {
    const path = window.location.pathname;

    if (path === '/pivotTable') {
        return <PivotTablePage />;
    }

    return <ExcelProcessor />;
}

export default App;
