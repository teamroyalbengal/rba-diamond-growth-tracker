"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type DailyTasksActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date.");
const taskSchema = z.object({
  id: z.string().uuid().optional(),
  task_order: z.number().int().min(1).max(3),
  title: z.string().trim().max(120, "Task title must be under 120 characters."),
  note: z.string().trim().max(400, "Task note must be under 400 characters.").optional(),
  is_completed: z.boolean()
});

export async function saveDailyTasks(
  _previousState: DailyTasksActionState,
  formData: FormData
): Promise<DailyTasksActionState> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Please login again to update your Top 3 tasks."
    };
  }

  const parsedDate = dateSchema.safeParse(String(formData.get("task_date") || ""));
  if (!parsedDate.success) {
    return {
      status: "error",
      message: parsedDate.error.issues[0]?.message || "Please choose a valid date."
    };
  }

  const taskDate = parsedDate.data;
  const parsedTasks = [1, 2, 3].map((order) =>
    taskSchema.safeParse({
      id: String(formData.get(`task_${order}_id`) || "") || undefined,
      task_order: order,
      title: String(formData.get(`task_${order}_title`) || ""),
      note: String(formData.get(`task_${order}_note`) || ""),
      is_completed: formData.get(`task_${order}_completed`) === "on"
    })
  );
  const invalidTask = parsedTasks.find((task) => !task.success);

  if (invalidTask && !invalidTask.success) {
    return {
      status: "error",
      message: invalidTask.error.issues[0]?.message || "Please check your Top 3 tasks."
    };
  }

  const tasks = parsedTasks.flatMap((task) => (task.success ? [task.data] : []));

  const tasksToSave = tasks.filter((task) => task.title.length > 0);
  const blankExistingTaskIds = tasks
    .filter((task) => task.title.length === 0 && task.id)
    .map((task) => task.id as string);

  if (tasksToSave.length) {
    const { error } = await supabase.from("daily_tasks").upsert(
      tasksToSave.map((task) => ({
        user_id: user.id,
        task_date: taskDate,
        task_order: task.task_order,
        title: task.title,
        note: task.note || null,
        is_completed: task.is_completed,
        points: 10
      })),
      {
        onConflict: "user_id,task_date,task_order"
      }
    );

    if (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }

  if (blankExistingTaskIds.length) {
    const { error } = await supabase
      .from("daily_tasks")
      .delete()
      .eq("user_id", user.id)
      .in("id", blankExistingTaskIds);

    if (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");

  return {
    status: "success",
    message: "Top 3 tasks save হয়ে গেছে."
  };
}
