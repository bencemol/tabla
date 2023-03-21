import GlobalSpinner from "@/components/spinner/GlobalSpinner";

export default function Loading() {
  console.log("loading tasks");

  return <GlobalSpinner />;
  // return (
  //   <Modal title=" " isOpen={true} isLoading={true}>
  //     <section>
  //       <label htmlFor="title">Title</label>
  //       <input id="title" name="title" type="text" disabled />
  //     </section>
  //     <section>
  //       <label htmlFor="description">Description</label>
  //       <textarea
  //         id="description"
  //         name="description"
  //         rows={5}
  //         cols={30}
  //         className="resize-none"
  //         disabled
  //       />
  //     </section>
  //     <footer>
  //       <Button type="submit" variant="primary">
  //         Save
  //       </Button>
  //       <Button type="button">Cancel</Button>
  //     </footer>
  //   </Modal>
  // );
}
