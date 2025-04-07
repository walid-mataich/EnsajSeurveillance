import avatar from '../assets/homev1.png'

const Hero =()=>{
    return(
        <div className="bg-white dark:bg-blue-800 text-white flex flex-col md:flex-row w-full justify-between items-center gap-8 p-6 md:p-16 lg:p-20">
  {/* Image */}
  <div className="w-full md:w-2/5 flex justify-center">
    <img
      src={avatar}
      alt="Avatar"
      className="w-[250px] md:w-[300px] lg:w-[500px] h-auto object-contain"
    />
  </div>

  {/* Text Content */}
  <div className="w-full md:w-3/5 flex flex-col gap-4 text-center md:text-left">
    <h1 className="text-3xl md:text-5xl lg:text-6xl text-blue-800 dark:text-white font-bold leading-tight tracking-tight">
      Bienvenue à SurvEnsaj
    </h1>
    <p className="text-sm md:text-lg lg:text-2xl text-blue-800 dark:text-white tracking-tight">
    Plateforme pour automatiser la gestion de la surveillance des examens.
    </p>
  </div>
</div>

    )
};

export default Hero
