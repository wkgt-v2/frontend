export interface HttpSuccess<T> {
  success: true;
  data: T;
  message: string;
}

interface HttpError {
  success: false;
  message: string;
}
