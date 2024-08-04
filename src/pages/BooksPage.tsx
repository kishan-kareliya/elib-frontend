import { deleteBook, getBooks } from "@/http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { File, MoreHorizontal, PlusCircle, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import bookType from "@/types";
import { useNavigate } from "react-router-dom";

const BooksPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
    staleTime: 10000,
  });

  const mutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      console.log("Book deleted successfully!");
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  const redirectCreateBook = () => {
    navigate("/dashboard/books/create");
  };

  if (isLoading || mutation.isPending) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-red-500">
        Something went wrong!
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:gap-4 sm:py-2 sm:pl-2">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Books</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button
                onClick={redirectCreateBook}
                size="sm"
                className="h-8 gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Book
                </span>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Books</CardTitle>
                <CardDescription>
                  Manage your books and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Price
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Author
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created at
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((book: bookType) => (
                      <TableRow key={book._id}>
                        <TableCell className="hidden sm:table-cell">
                          <img
                            alt={book.title}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={book.coverImage}
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {book.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{book.genre}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          $499.99
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {book.author}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {book.createdAt.split("T")[0]}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(book._id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BooksPage;
