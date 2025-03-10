import './App.css';
import { axiosInstance as axios } from './apis/axios';
import { getIconComponent } from './utils';

function App() {

  const InIcon = getIconComponent('in-black');
  return (
    <span>
      <h1>hello Frontend Team!</h1>
      <InIcon />
    </span>
  )
}

export default App
