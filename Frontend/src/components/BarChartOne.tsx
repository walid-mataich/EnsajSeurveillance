import { useEffect, useState } from "react";
import React from "react";
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import api from '../api/axios';

export default function LabelsAboveBars() {
  // États pour stocker les données récupérées
  const [professeurCount, setProfesseurCount] = useState(0);
  const [vacataireCount, setVacataireCount] = useState(0);
  const [doctorantCount, setDoctorantCount] = useState(0);

  useEffect(() => {

    api.get('/surveillants/count/Professeur')
      .then(response => setProfesseurCount(response.data))
      .catch(error => console.error("Erreur lors du chargement des données pour Professeur", error));

    api.get('/surveillants/count/Vacataire')
      .then(response => setVacataireCount(response.data))
      .catch(error => console.error("Erreur lors du chargement des données pour Vacataire", error));

    api.get('/surveillants/count/Doctorant')
      .then(response => setDoctorantCount(response.data))
      .catch(error => console.error("Erreur lors du chargement des données pour Doctorant", error));
  }, []);

  // Les catégories et les valeurs qui seront affichées dans le graphique
  const categories = ['Professeur', 'Vacataire', 'Doctorant'];
  const values = [professeurCount, vacataireCount, doctorantCount];

  return (
    <ChartContainer
      xAxis={[{ scaleType: 'band', data: categories }]}
      series={[
        {
          type: 'bar',
          id: 'base',
          data: values,
          color: '#1d4ed8',
        },
      ]}
      width={400}
      height={300}
    >
      <BarPlot />
      <ChartsXAxis />
      <ChartsYAxis />
      <ChartsTooltip />
    </ChartContainer>
  );
}
