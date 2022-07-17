import { useCallback, useEffect, useState } from "react";

import MealItem from "./MealItem/MealItem"
import Card from "../UI/Card"
import classes from "./AvailableMeals.module.css"

const AvailableMeals = () => {
    const [meals, setMeals] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState()

    const fetchMeals = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch("https://react-http-food-app-2c1c0-default-rtdb.europe-west1.firebasedatabase.app/meals.json");
            if(!response.ok) {
                throw new Error("Something went wrong!")
            }
            const responseData = await response.json();
            const loadedMeals = [];
            for (const key in responseData) {
                loadedMeals.push(
                    {
                        id: key,
                        key: key,
                        name: responseData[key].name,
                        description: responseData[key].description,
                        price: responseData[key].price
                    }
                )
            }
            setMeals(loadedMeals)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            setHttpError(error.message)
        }
    }, [])

    useEffect(() => {
        fetchMeals()
    }, [fetchMeals])

    if (isLoading) {
        return <section className={classes.MealsLoading}>
            <p>Loading...</p>
        </section>
    }

    if (httpError) {
        return <section className={classes.MealsError}>
            <p>{httpError}</p>
        </section>
    }


    const mealsList = meals.map(meal => {
        return (
            <MealItem
                id={meal.id}
                key={meal.id}
                name={meal.name}
                desc={meal.description}
                price={meal.price}
            />
        )
    })

    return <section className={classes.meals}>
        <ul>
            <Card>
                {mealsList}
            </Card>
        </ul>
    </section>
}

export default AvailableMeals;