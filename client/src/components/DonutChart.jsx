import { PieChart, Pie, Cell, Tooltip, Legend} from "recharts"
import {useMediaQuery} from 'react-responsive'

const DonutChart  = ({data}) => {

    const isMd = useMediaQuery({minWidth: 768})

    const pieData = data.budgets? data.budgets.map(budget => ({
        name: budget.category,
        value: budget.maximum
    })) : [];

    const pieColors = data.budgets? data.budgets.map(color => color.theme) : [];

    return (
        <section className="flex flex-col items-center justify-center lg:w-60 ">
            
            <PieChart width={400} height={300}>
                <Pie 
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={ isMd? 80: 60}
                    outerRadius={ isMd? 130: 120}
                    fill="blue"
                >
                    {pieData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={pieColors[index % pieColors.length]}
                        />
                    ))}
                </Pie>
                <Tooltip/>
            </PieChart>
            
        </section>
    )

}

export default DonutChart;