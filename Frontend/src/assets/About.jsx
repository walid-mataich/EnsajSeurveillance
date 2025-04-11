// import image from '../assets/imageAbout.png'

const About = () => {
  return (
    <div className="bg-white dark:bg-blue-800 p-10">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center text-white bg-blue-800 dark:bg-blue-900 rounded-xl p-6 md:p-10 border border-gray-200 dark:border-gray-700 shadow-sm max-w-6xl mx-auto space-y-6 md:space-y-0">
        {/* Texte à gauche */}
        <div className="w-full md:w-1/2 space-y-8">
          {/* Section Surveillant */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Espace Surveillant
            </h1>
            <p className="text-sm md:text-base text-white mt-2">
              Le surveillant saisit son choix.
            </p>
          </div>

          {/* Section Admin */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Espace Administrateur
            </h1>
            <p className="text-sm md:text-base text-white mt-2">
              Dans cet espace, l'administrateur peut créer le planning des
              exams.
            </p>
          </div>
        </div>

        {/* Image à droite */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-center">
          <img
            src={image}
            alt="illustration"
            className="w-full max-w-md h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
