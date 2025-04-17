import React,{useEffect,useState} from "react";
import api from "../api/axios";


function Profile(){
const [surv,setSurv]=useState(null);
useEffect(()=>{
    const fetchUserConnecter = async() =>{
    try {
      const response = await api.get("surveillants/userConnecter");
      setSurv(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du surveillant connecter",
        error
      );
    }
  }
  fetchUserConnecter();
},[]);

return(
    <>
    {surv && (<div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
  <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Profil Surveillant</h2>
  <div className="space-y-4">
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">ID :</span>
      <span className="text-gray-900">{surv.id}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Nom :</span>
      <span className="text-gray-900">{surv.nom}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Username :</span>
      <span className="text-gray-900">{surv.username}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Email :</span>
      <span className="text-gray-900">{surv.email}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Type Prof :</span>
      <span className="text-gray-900">{surv.type}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">Nombre de surveillance :</span>
      <span className="text-gray-900">{surv.nbrSurveillance}</span>
    </div>
  </div>
</div>)}
    </>
);



}
export default Profile;