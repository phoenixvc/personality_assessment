import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TestSelection from './components/TestSelection';
import Big5Quiz from './components/methods/big5/Big5Quiz';
import Big5Results from './components/methods/big5/Big5Results';
import MyersBriggsQuiz from './components/methods/myersbriggs/MyersBriggsQuiz';
import MyersBriggsResults from './components/methods/myersbriggs/MyersBriggsResults';
import DiscQuiz from './components/methods/disc/DiscQuiz';
import DiscResults from './components/methods/disc/DiscResults';
import OtherMethodsQuiz from './components/methods/othermethods/OtherMethodsQuiz';
import OtherMethodsResults from './components/methods/othermethods/OtherMethodsResults';
import EnneagramQuiz from './components/methods/enneagram/EnneagramQuiz';
import EnneagramResults from './components/methods/enneagram/EnneagramResults';
import HoganQuiz from './components/methods/hogan/HoganQuiz';
import HoganResults from './components/methods/hogan/HoganResults';
import SixteenPFQuiz from './components/methods/sixteenpf/SixteenPFQuiz';
import SixteenPFResults from './components/methods/sixteenpf/SixteenPFResults';

function App() {
  return (
    <div className="App">
      <Header />
      <TestSelection />
      <Footer />
    </div>
  );
}

export default App;
