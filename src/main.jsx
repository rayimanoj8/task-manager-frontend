import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ThemeProvider} from "@/context/theme-provider.jsx";
import {Provider} from "react-redux";
import store from "@/redux/store.js";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Tasks from "@/components/Tasks.jsx";
import {EmptyComponent} from "@/components/Empty.jsx";
import WeatherTaskSuggestions from "@/components/test.jsx";
createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <Provider store={store}>
      <Router>
          <Routes>
              <Route path="/" element={<App/>} >
                  <Route path="" element={<EmptyComponent/>} />
                  <Route path="/:pid" element={<Tasks/>} />
                  <Route path="/weather" element={<WeatherTaskSuggestions/>}/>
              </Route>
          </Routes>
      </Router>
    </Provider>
  </ThemeProvider>,
)
/*
* /
* /projectID
* */