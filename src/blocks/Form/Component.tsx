'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { Media as MediaComponent } from '@/components/Media'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

import { motion, useInView } from 'motion/react'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  form: FormType
  intro?: DefaultTypedEditorState
  imageLight?: Media | number | null
  imageDark?: Media | number | null
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    intro,
    imageLight,
    imageDark,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const hasBgMedia =
    (typeof imageLight === 'object' && imageLight !== null) ||
    (typeof imageDark === 'object' && imageDark !== null)

  return (
    <section className="relative py-16 md:py-24">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 w-full relative bg-brand rounded-xl overflow-hidden"
        >
          {intro && !hasSubmitted && (
            <div className='relative w-full h-full flex items-center justify-center'>
              {hasBgMedia && (
                <>
                  {typeof imageLight === 'object' && imageLight !== null && (
                    <MediaComponent
                      resource={imageLight}
                      className="absolute inset-0 h-full w-full -z-10"
                      pictureClassName="h-full w-full"
                      imgClassName="h-full w-full object-cover dark:hidden"
                    />
                  )}
                  {typeof imageDark === 'object' && imageDark !== null && (
                    <MediaComponent
                      resource={imageDark}
                      className="absolute inset-0 h-full w-full -z-10"
                      pictureClassName="h-full w-full"
                      imgClassName="hidden h-full w-full object-cover dark:block"
                    />
                  )}
                </>
              )}
              <RichText
                className=" p-6 md:p-12 [&_h2]:type-headline-2 [&_h2]:text-white [&_h3]:type-label-lg [&_h3]:text-type-body [&_p]:type-body-xl [&_p]:text-white [&_a]:text-type-body [&_a]:hover:underline"
                data={intro}
                enableGutter={false}
              />
            </div>
          )}
          <div className="px-6 py-8 md:px-24 md:py-24 bg-muted">
            <FormProvider {...formMethods}>
              {!isLoading && hasSubmitted && confirmationType === 'message' && (
                <RichText
                  data={confirmationMessage}
                  enableGutter={false}
                  className="[&_h3]:type-headline-3 [&_h3]:text-type-heading [&_p]:type-body-lg [&_p]:text-type-body"
                />
              )}
              {isLoading && !hasSubmitted && (
                <p className="type-body-md text-type-secondary animate-pulse">
                  Loading, please wait...
                </p>
              )}
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive type-body-sm border border-destructive/20 mb-6">
                  {`${error.status || '500'}: ${error.message || ''}`}
                </div>
              )}
              {!hasSubmitted && (
                <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-8 md:mb-12 last:mb-0">
                    {formFromProps &&
                      formFromProps.fields &&
                      formFromProps.fields?.map((field, index) => {
                        const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                        if (Field) {
                          return (
                            <div className="mb-6 last:mb-0" key={index}>
                              <Field
                                form={formFromProps}
                                {...field}
                                {...formMethods}
                                control={control}
                                errors={errors}
                                register={register}
                              />
                            </div>
                          )
                        }
                        return null
                      })}
                  </div>

                  <Button form={formID} type="submit" variant="default" size="lg" className="w-full md:w-auto">
                    {submitButtonLabel}
                  </Button>
                </form>
              )}
            </FormProvider>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
