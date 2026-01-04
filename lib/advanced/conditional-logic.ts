"use server"

interface Condition {
  field: string
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  value: string | number
}

interface ConditionalLogic {
  show_if?: Condition
  skip_if?: Condition[]
}

export async function evaluateCondition(condition: Condition, answers: Record<string, any>): Promise<boolean> {
  const answerValue = answers[condition.field]

  switch (condition.operator) {
    case "equals":
      return answerValue == condition.value
    case "not_equals":
      return answerValue != condition.value
    case "contains":
      return String(answerValue).includes(String(condition.value))
    case "greater_than":
      return Number(answerValue) > Number(condition.value)
    case "less_than":
      return Number(answerValue) < Number(condition.value)
    default:
      return true
  }
}

export async function shouldShowStep(logic: ConditionalLogic | null, answers: Record<string, any>): Promise<boolean> {
  if (!logic) return true

  // Check show_if condition
  if (logic.show_if) {
    return await evaluateCondition(logic.show_if, answers)
  }

  // Check skip_if conditions (all must be false to show)
  if (logic.skip_if && logic.skip_if.length > 0) {
    const results = await Promise.all(logic.skip_if.map((condition) => evaluateCondition(condition, answers)))
    const shouldSkip = results.some((result) => result)
    return !shouldSkip
  }

  return true
}
