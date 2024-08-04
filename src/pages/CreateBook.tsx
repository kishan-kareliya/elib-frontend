import { BookCheck, CircleX, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook } from "@/http/api";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters",
  }),
  genre: z.string().min(2, {
    message: "genre must be at least 2 characters",
  }),
  description: z.string().min(5, {
    message: "description must be at least 5 characters",
  }),
  coverImage: z.instanceof(FileList).refine((file) => {
    return file.length === 1;
  }, "Cover Image required"),
  bookFile: z.instanceof(FileList).refine((file) => {
    return file.length === 1;
  }, "Book Pdf file required"),
});

const CreateBook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      genre: "",
      description: "",
    },
  });
  const coverImageRef = form.register("coverImage");
  const fileRef = form.register("bookFile");

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      console.log("book created successfully!");
      navigate("/dashboard/books");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("genre", values.genre);
    formData.append("description", values.description);
    formData.append("coverImage", values.coverImage[0]);
    formData.append("file", values.bookFile[0]);

    mutation.mutate(formData);

    console.log(values);
  };

  const cancelHandler = () => {
    navigate("/dashboard/books");
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-2 sm:pl-2">
      <Form {...form}>
        <form action="" onSubmit={form.handleSubmit(onSubmit)}>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <Link
                        className="hover:text-foreground"
                        to="/dashboard/home"
                      >
                        Home
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Link
                        className="hover:text-foreground"
                        to="/dashboard/books"
                      >
                        Books
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={cancelHandler}
                    variant={"outline"}
                    className="h-8 gap-1"
                  >
                    <CircleX className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Cancel
                    </span>
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    className="h-8 gap-1"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <>
                        <BookCheck className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add Book
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                  <CardHeader>
                    <CardTitle>Add Book</CardTitle>
                    {mutation.error ? (
                      <div className="text-red-500">
                        {mutation.error.message}
                      </div>
                    ) : (
                      <>
                        <CardDescription>
                          Add your new books and view their sales performance.
                        </CardDescription>
                      </>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genre</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>description</FormLabel>
                            <FormControl>
                              <Textarea className="w-full" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="coverImage"
                        render={() => (
                          <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <FormControl>
                              <Input
                                id="coverImage"
                                className="bg-gray-50"
                                type="file"
                                {...coverImageRef}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bookFile"
                        render={() => (
                          <FormItem>
                            <FormLabel>Book Pdf File</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-50"
                                type="file"
                                {...fileRef}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </form>
      </Form>
    </div>
  );
};

export default CreateBook;
