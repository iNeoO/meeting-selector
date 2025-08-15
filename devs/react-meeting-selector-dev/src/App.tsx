import { SimpleAsyncExample } from './components/SimpleAsyncExample';
import { SimpleExample } from './components/SimpleExample';
import { MultiExample } from './components/MultiExample';
import { MultipleRendersElementsExample } from './components/MultipleRendersElementsExample';

const App = () => (
  <>
    <h1>Simple example</h1>
    <SimpleExample />
    <h1>Simple async example</h1>
    <SimpleAsyncExample />
    <h1>Multi example</h1>
    <MultiExample />
    <h1>Multiple renders elements example</h1>
    <MultipleRendersElementsExample />
  </>
);

export default App;
