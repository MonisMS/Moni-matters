import  { useState } from 'react'
import { Card,CardHeader,CardTitle,CardContent ,CardFooter} from './components/ui/card'
import { Button } from './components/ui/button'
import AddExpenseForm from './components/ui/expenseAdd'
import ExpenseList from './components/ui/listExpenses'

const App = () => {
  const [refresh, setRefresh] = useState(0);
const handleAdded = () =>{
  setRefresh((prev) => prev + 1);
}  
return (
     <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* simple smoke test content */}
          <p className="text-sm text-muted-foreground">
            If you can see this styled card and the buttons below, Tailwind + shadcn are working.
          </p>
          <div className="flex gap-2">
            <Button>Default</Button>
            <Button variant="destructive" size="sm">Delete</Button>
            <Button variant="outline" size="lg">Outline</Button>
          </div>
          <AddExpenseForm onadded={handleAdded} />
          <ExpenseList refreshKey={refresh} />
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">We’ll build the form next.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
