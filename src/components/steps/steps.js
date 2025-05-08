import React, { useState } from 'react';
// import './index.css';
import { Button, message, Steps, theme } from 'antd';



const StepsADD = () => {
  // const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: 'First',
      content: 
      <>
<div className="agen t-modal">
<p className="ModalagentAdd">Information de l'agent</p>
  </div>     
      
      </>,
    },
    {
      title: 'Second',
      content: 'Second-content',
    },
    {
      title: 'Last',
      content: 'Last-content',
    },
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle = {
    lineHeight: '50px',
    textAlign: 'center',
    
   
    marginTop: 16,
  };
 
  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Suivant
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Ajouter avec sucsesss!')}>
            Sauvgarder
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Retour
          </Button>
        )}
      </div>
    </>
  );
};

export default StepsADD;