import ReactDOM from 'react-dom/client';
import { Router } from 'routes';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RecoilRoot>
    <Router />
  </RecoilRoot>
);
