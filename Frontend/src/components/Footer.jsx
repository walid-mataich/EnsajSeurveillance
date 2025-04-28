const Footer = () => {
    return (
        <footer className="bg-blue-800 text-white py-8">
            {/* <h1 className="text-3xl font-bold ml-[80px] mb-4">SurvEnsaj  </h1>   */}
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-4">Coordonnées</h3>
                <p className="text-sm">Route d'Azemmour, Nationale N°1</p>
                <p className="text-sm">BP : 5096 El Jadida</p>
                <p className="text-sm">Tel: (+212) 5 23 34 48 22</p>
                <p className="text-sm">Fax : 05 23 39 49 15</p>
              </div>
              <div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Directeurs</h3>
                <ul className="space-y-2 text-sm">
                  <li>Pr. Abdelowahed Hajjaji</li>
                  <li>Pr. Mahmoud El Mouden</li>
                  <li>Pr. Aziz Dahbi</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-blue-800 pt-4 text-center text-sm">
              <p> © 2025 SurvEnsaj. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </footer>
    );
  };
  
  export default Footer;