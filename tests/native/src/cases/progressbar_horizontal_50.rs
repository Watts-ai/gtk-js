use relm4::prelude::*;

pub struct ProgressbarHorizontal50;

#[relm4::component(pub)]
impl SimpleComponent for ProgressbarHorizontal50 {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ProgressBar {
            set_fraction: 0.5,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
