import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
export const Home = () => {
	const {store, dispatch} =useGlobalReducer()
	 return (
    <div
      style={{
        display: "flex",            
        justifyContent: "center",   
        alignItems: "center",       
        height: "100vh",            
        textAlign: "center",        
        color: "#fff",              
        backgroundColor: "#000",    
        flexDirection: "column"     
      }}
    >
      <h1>Star Wars</h1>
    </div>
  );
};