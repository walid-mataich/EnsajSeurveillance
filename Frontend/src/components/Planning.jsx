import React, { useEffect, useState } from "react";
import api from "../api/axios"; // Assuming your API file is in the api folder
import { format } from "date-fns";

const Planning = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/examen/all');
                setExams(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center text-2xl">Loading...</div>;
    if (error) return <div className="text-center text-red-500 text-2xl">{error}</div>;

    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const examsByDay = {};

    exams.forEach(exam => {
        // Ensure `exam.jour` is a valid date
        const dayDate = new Date(exam.jour);
        if (isNaN(dayDate.getTime())) {
            console.error(`Invalid date for exam ID ${exam.idExamen}:`, exam.jour);
            return;
        }

        const day = dayDate.toLocaleDateString('fr-FR', { weekday: 'long' });
        const date = dayDate.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });

        if (!examsByDay[day]) {
            examsByDay[day] = [];
        }

        examsByDay[day].push({
            ...exam,
            date
        });
    });

    const isValidTime = (time) => {
        const timeDate = new Date(`1970-01-01T${time}`);
        return !isNaN(timeDate.getTime());
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Heure
                        </th>
                        {daysOfWeek.map((day, index) => (
                            <th key={index} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {day} <br /> {examsByDay[day]?.[0]?.date || '-'}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {exams.map(exam => {
                        // Validate `exam.debut` and `exam.fin`
                        const debut = isValidTime(exam.debut) ? format(new Date(`1970-01-01T${exam.debut}`), 'HH:mm') : '-';
                        const fin = isValidTime(exam.fin) ? format(new Date(`1970-01-01T${exam.fin}`), 'HH:mm') : '-';

                        return (
                            <tr key={exam.idExamen}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    {debut} - {fin}
                                </td>
                                {daysOfWeek.map((day, index) => {
                                    const examForDay = examsByDay[day]?.find(e => e.idExamen === exam.idExamin);
                                    return (
                                        <td key={index} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {examForDay?.matiere.nomMatiere || '-'}
                                            <br />
                                            {examForDay?.matiere.chefDeModule.nom || '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Planning;
