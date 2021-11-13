import { useFormik } from "formik";
import { useMemo } from "react";
import Select from "react-select";
import { Card } from "src/components/Card/Card";
import { getTags } from "src/util/get-tags";
import styles from "./submit.module.scss";
import * as Yup from "yup";

export default function Submit() {
  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: {
      title: "",
      description: "",
      tags: [] as SelectOption[],
      link: "",
      username: "",
    },
    onSubmit: (values) => {},
    validationSchema: Yup.object().shape({
      title: Yup.string(),
      description: Yup.string().max(
        150,
        "Description is too long, please keep it under 150 characters"
      ),
      tags: Yup.array(),
      link: Yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Please enter a valid URL"
      ),
      username: Yup.string(),
    }),
  });

  return (
    <div>
      <Card className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Label label="Title" error={errors.title}>
            <input
              type="text"
              name="title"
              required
              value={values.title}
              onChange={handleChange}
            />
          </Label>
          <Label
            label="Link"
            description="URL to the resource"
            error={errors.link}
          >
            <input
              type="text"
              name="link"
              value={values.link}
              onChange={handleChange}
            />
          </Label>
          <Label
            label="Description"
            description="A short blurb about this resource"
            error={errors.description}
          >
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
            />
          </Label>
          <Label
            label="Tags"
            description="Choose 1 to 3 tags that best fit this resource"
            error={errors.tags as string}
          >
            <TagsSelect
              value={values.tags}
              onChange={(tags) => setFieldValue("tags", tags)}
            />
          </Label>
          <Label
            label="GitHub Username (optional)"
            description="Adds your username to the generated pull request"
            error={errors.username}
          >
            <input
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
            />
          </Label>
          <button className={styles.button} disabled={isSubmitting}>
            Submit
          </button>
        </form>
      </Card>
    </div>
  );
}

function Label({
  label,
  description,
  children,
  error,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className={styles.label} data-error={!!error}>
      <span className={styles.labelTitle}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
      {children}
      <span className={styles.error}>{error}</span>
    </label>
  );
}

interface SelectOption {
  label: string;
  value: string;
}

function TagsSelect({
  value,
  onChange,
}: {
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
}) {
  const options = useMemo<SelectOption[]>(
    () =>
      getTags()
        .filter((tag) => tag !== "Team Pick")
        .map((tag) => ({
          label: tag,
          value: tag,
        })),
    []
  );

  return (
    <Select
      instanceId="tags"
      isMulti
      value={value}
      // limit to 3
      options={value.length > 3 ? value : options}
      menuPortalTarget={process.browser ? document.body : null}
      onChange={(v) => onChange(v as SelectOption[])}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
}
