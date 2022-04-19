export default function Loading(){
  return (
    <div className="loading-component">
      <div className="loading-wrapper">
        <svg className="loading-circle" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle className="circle-stroke" cx="25" cy="25" r="20"/>;
        </svg>
        <svg className="loading-circle" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle className="circle-stroke-two" cx="25" cy="25" r="20"/>;
        </svg>
      </div>
      <h3>Ingesting</h3>
    </div>
  );
}