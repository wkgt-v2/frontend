export interface HttpSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export interface HttpSuccessWithPagination<T> {
  success: true;
  data: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    data: T;
  };
  message: string;
}

interface HttpError {
  success: false;
  message: string;
}
